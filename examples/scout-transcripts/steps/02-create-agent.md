# Create an Agent Using Scout

Instead of manually configuring an agent in the Studio, we'll ask Scout (our AI assistant) to create one for us. This is one of the fastest ways to get started!

## What to Do

Open Scout and type the following prompt:

```
Create an agent that reads and summarizes call transcripts.

These transcripts are available on the Call Transcript Simulator service at:
https://call-transcript-simulator.onrender.com

You can use code to fetch the instructions at /api/agents.

If the input is an ID, use code to generate a GraphQL query to get 
the transcript, then summarize the call. Extract the participants 
and company name.
```

## What Happens Next

Scout will:

1. **Create** a new agent called something like "Call Transcript Summarizer"
2. **Notice** that code execution is needed
3. **Update** the agent configuration to enable TypeScript execution

You'll see Scout working through this process in real-time. When it's done, it will give you the agent ID.

## Copy the Agent ID

When Scout finishes, you'll see a message like:

> Agent created successfully! ID: `abc123xyz`

**Copy this ID** - you'll need it in the next step to view and configure your agent.

> **Pro Tip:** You can also create agents manually in Studio → New Agent, but using Scout is often faster for getting started quickly.

## Verify in Studio

Once created, you can find your agent in the Studio. Click on **Agents** in the left sidebar and look for your new "Call Transcript Summarizer" agent.
