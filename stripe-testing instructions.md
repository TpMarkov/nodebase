1. open new terminal and navigate to "D:\PROGRAMS\stripe" or where the stripe.exe is located
2. in the terminal tipe .\stripe.exe
3. then type in the terminal . .\stripe listen
   --forward-to "http://localhost:3000/api/workflows/stripe?workflowId=YOUR_WORKFLOW_ID"
4. Follow the link along and allow access to stripe
5. then open a new terminal to send an api request type in .\stripe trigger custommer.created or .\stripe trigger
   payment_intent.succeeded