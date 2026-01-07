# Configure Your Agent

Now let's make sure your agent has the right settings and tools enabled.

## Open the Agent Details

1. Go to the **Studio** in ScoutOS
2. Click on your **Call Transcript Summarizer** agent
3. Or use the agent ID from the previous step and click "View Agent Details"

## Quick Orientation

On the agent configuration page, you'll see:

- **Name**: The agent's display name
- **Icon**: Optional visual identifier
- **Description**: What this agent does
- **Model**: The AI model to use (we recommend **Claude 3.5 Sonnet** or **Opus**)
- **Instructions**: The system prompt that guides the agent's behavior

## Check the Instructions

Scout should have created instructions based on your prompt. Review them to make sure they include:

- How to fetch transcripts from the simulator service
- How to parse the GraphQL response
- How to format the summary output

## Add Code Execution Tools

This is the critical step! Your agent needs permission to run code.

1. Scroll down to the **Tools** section
2. Click **Add Tool**
3. Search for "Execute TypeScript" or "Execute Code"
4. Select it to enable code execution

```
Tools: Execute TypeScript ✓
```

## Set the Model

For best results, set the model to a capable option:

1. Find the **Model** dropdown
2. Select **Claude 3.5 Sonnet** or **Claude 3 Opus**

## Save Your Changes

Click **Save** to persist your configuration.

> **Important:** Make sure to save before moving on! Your changes won't take effect until saved.
