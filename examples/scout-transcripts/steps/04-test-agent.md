# Test Your Agent

Before connecting the agent to a workflow, let's make sure it works correctly.

## Get a Test Transcript ID

1. Open the [Call Transcript Simulator](https://call-transcript-simulator.onrender.com) in a new tab
2. Generate a sample transcript (any type works)
3. Copy the **Transcript ID** that appears

It will look something like: `4c5d6e7f-8a9b-0c1d-2e3f-4a5b6c7d8e9f`

## Test in the Agent Preview

Back in your agent configuration page:

1. Find the **Preview** or **Test** section
2. Paste the transcript ID
3. Click **Run** or press Enter

## What to Expect

Your agent should:

1. Recognize the ID format
2. **Execute TypeScript** to make a GraphQL request
3. Fetch the transcript from the simulator
4. Return a summary with:
   - **Call Summary**: Overview of the conversation
   - **Participants**: Who was on the call
   - **Key Topics**: Main discussion points
   - **Action Items**: Next steps mentioned
   - **Sentiment**: Overall tone of the call

## Example Output

```
📞 Call Summary

Participants: John (Sales Rep), Sarah (Customer - Acme Corp)

Summary: This was a discovery call to understand Acme Corp's 
current workflow challenges. Sarah expressed frustration with 
their existing tool's complexity.

Key Insights:
- Customer is evaluating 3 solutions
- Budget decision needs VP approval
- Timeline: Q2 implementation preferred

Action Items:
1. Send product demo recording
2. Schedule technical deep-dive
3. Prepare ROI analysis

Sentiment: Positive - customer showed strong interest
```

## Troubleshooting

**If the agent doesn't execute code:**
- Make sure you added the "Execute TypeScript" tool
- Verify you clicked Save after adding it

**If you get an error fetching the transcript:**
- Check that the ID is correct
- The simulator service might be warming up (wait 30 seconds and retry)
