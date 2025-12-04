"use client";
import React from "react";
import {
  useSuspenseExecution,
  useSuspenseExecutions,
} from "@/features/executions/hooks/use-executions";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";

import { useRouter } from "next/navigation";
import { useExecutionsParams } from "@/features/executions/hooks/use-executions-params";
import { formatDistanceToNow } from "date-fns";
import { ExecutionStatus } from "@prisma/client";

import type { Credential } from "@prisma/client";
import { CredentialType } from "@prisma/client";

import Image from "next/image";
import type { Execution } from "@prisma/client";
import {
  CheckCircleIcon,
  ClockIcon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";

const ExecutionsList = () => {
  const executions = useSuspenseExecutions();

  return (
    <EntityList
      items={executions.data.items}
      getKey={(execution) => execution.id}
      emptyView={<ExecutionsEmpty />}
      renderItem={(execution) => <ExecutionItem data={execution} />}
    />
  );
};
export default ExecutionsList;

export const ExecutionsHeader = () => {
  return (
    <>
      <EntityHeader
        title={"Executions"}
        description={"View your execution workflows history"}
      />
    </>
  );
};

export const ExecutionsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<ExecutionsHeader />}
      pagination={<ExecutionsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const ExecutionsPagination = () => {
  const executions = useSuspenseExecutions();
  const [params, setParams] = useExecutionsParams();

  return (
    <EntityPagination
      disabled={executions.isFetching}
      page={executions.data.page}
      totalPages={executions.data.totalPages}
      onPageChange={(page) => {
        setParams({ ...params, page });
      }}
    />
  );
};

export const ExecutionsLoading = () => {
  return <LoadingView message={"Loading Executions..."} />;
};

export const ExecutionsError = () => {
  return <ErrorView message={"Error loading Executions"} />;
};

export const ExecutionsEmpty = () => {
  const router = useRouter();

  return (
    <EmptyView
      message={
        "You haven't created any executions yet. Get started by running your first workflow."
      }
    />
  );
};


const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return <CheckCircleIcon className="size-5 text-green-600" />;
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="size-5 text-red-600" />;
    case ExecutionStatus.RUNNING:
      return <Loader2Icon className="size-5 text-blue-600 animate-spin" />;
    default:
      return <ClockIcon className="size-5 text-muted-foreground" />;
  }
};

export const ExecutionItem = ({
  data,
}: {
  data: Execution & {
    workflow: {
      id: string;
      name: string;
    };
  };
}) => {
  const duration = data.completedAt
    ? Math.round(
      new Date(data.completedAt).getTime() -
      new Date(data.startedAt).getTime(),
    ) / 1000
    : null;

  const subtitle = (
    <>
      {data.workflow.name} &bull; Started{" "}
      {formatDistanceToNow(data.startedAt, { addSuffix: true })}
      {duration !== null && <> &bull; Took {duration}s </>}
    </>
  );

  return (
    <EntityItem
      href={`/executions/${data.id}`}
      title={data.status}
      subtitle={subtitle}
      image={
        <div className={"size-8 flex items-center justify-center"}>
          {getStatusIcon(data.status)}
        </div>
      }
    />
  );
};
