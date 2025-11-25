import toposort from "toposort"
import {Connection, Node} from "@/generated/prisma/client";
import {NonRetriableError} from "inngest";

export const topologicalSort = (nodes: Node[], connections: Connection[]): Node[] => {

  //  If no connections. return node as-is (No connections included - just nodes)
  if (connections.length === 0) {
    return nodes
  }

  //  Create edges array for toposort
  const edges: [string, string][] = connections.map((conn) => [
    conn.fromNodeId, conn.toNodeId
  ])

  //  Add nodes with no connections as self-edges to ensure they're included
  const connectedNodesId = new Set<string>()
  for (const conn of connections) {
    connectedNodesId.add(conn.fromNodeId)
    connectedNodesId.add(conn.toNodeId)
  }

  for (const node of nodes) {
    if (!connectedNodesId.has(node.id)) {
      edges.push([node.id, node.id])
    }
  }

  //  Perform topological sort
  let sortedNodeIds: string[]
  try {
    sortedNodeIds = toposort(edges)
    //  Remove duplicates (from self-edges)
    sortedNodeIds = [...new Set(sortedNodeIds)]
    console.log(sortedNodeIds)
  } catch (e) {
    if (e instanceof Error && e.message.includes("Cyclic")) {
      throw new Error(`Workflow contains a cycle error: ${e}`)
    }
    throw e
  }

// Map sorted IDs back to nodes object
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))
  return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean)
}