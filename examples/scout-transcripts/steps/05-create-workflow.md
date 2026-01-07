# Create a Workflow

Now that your agent works, let's create a workflow that can be triggered automatically.

## Navigate to Workflows

1. Click **Workflows** in the left sidebar
2. Click **New Workflow** to create a fresh workflow

## Add an Input Trigger

The first node in your workflow defines how it starts.

1. Click on the **trigger** node (or "Start" node)
2. Select **Input** as the trigger type
3. This allows the workflow to receive data when invoked

## Add Your Agent

Now connect your agent to the workflow:

1. Click the **+** button after the trigger
2. Select **Message Agent** (or "Call Agent")
3. Choose your **Call Transcript Summarizer** agent from the list

## Configure the Agent Node

Set up how data flows into your agent:

1. Click on the agent node to configure it
2. For the **Message** field, select **Input Message**
3. This passes whatever input the workflow receives directly to the agent

Your workflow should look like:

```
[Input Trigger] → [Call Transcript Summarizer Agent]
```

## Test the Workflow

Before publishing, let's test it:

1. Click **Run Test** (or similar button)
2. For the input, paste a transcript ID from the simulator
3. Watch the workflow execute

You should see:
- The input being received
- The agent processing the request
- The final summary output

## Publish the Workflow

Once testing works:

1. Click **Publish** to make the workflow live
2. Give it a descriptive name if prompted

> **Note:** Published workflows can receive webhook triggers, which we'll set up next.
