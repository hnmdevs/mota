---
title: Quick Start
description: Get up and running with a new Mota project in just a few seconds.
---
<Steps>

<Step>
### 1. Create Your Project

Use `npx` to create a new Mota project. This single command will scaffold a new application and install all necessary dependencies.

```bash
npx mota@latest create -i
```

![Create App Command](/docs-images/mota-build-your-app-1.gif)

The installer will guide you through a few questions to set up your project. Once it's done, you will have a new project directory ready to go.

</Step>

<Step>
### 2. Start the Development Server

Navigate into your new project directory and start the Mota development server.

```bash
cd <your-project-name> # If you've created a new folder for the project, navigate into it

npx mota dev
```

![run dev command](/docs-images/mota-build-your-app-2.png)

<Callout>
The `create` command uses `npm` by default. If you chose a different package manager during setup, use `pnpm dev`, `yarn dev`, or `bun dev`.
</Callout>

This command starts the Mota runtime and the Workbench, a powerful UI for developing and debugging your workflows. By default, it's available at [`http://localhost:3000`](http://localhost:3000).

</Step>

<Step>
### 3. Run Your First Flow

The starter project comes with a pre-built `default` flow. Let's run it.

1.  **Open the Workbench** in your browser at [`http://localhost:3000`](http://localhost:3000).
2.  **Select the `default` flow** from the left top panel.
3.  **Run the flow.** You'll see a visual diagram of the workflow. Find the first node (the API Step) and click the **Start** button on it. This will trigger the flow.
4.  **Observe the execution.** Watch the trace unfold in real-time in the bottom panel. You can inspect the logs, traces and state for each step as it completes.
5.  **Explore the Workbench.** You can also read your files directly from the Workbench.

![run starter app](/docs-images/mota-build-your-app.gif)

</Step>

<Step>
### Next Steps

Congratulations! You've successfully created, run, and observed your first Mota workflow.

- To build a multi-language application from scratch, follow our **[Build Your First App](/docs/getting-started/build-your-first-app)** guide.
- To learn about Mota, dive into our **[Welcome to Mota](/docs)**.

</Step>
</Steps>
