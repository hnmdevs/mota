---
title: Command Line Interface (CLI)
description: Learn how to use the Mota CLI to manage your projects and workflows
---

# Command Line Interface (CLI)

Mota provides a powerful Command Line Interface (CLI) to help you manage your projects and workflows. The CLI offers various commands for creating projects, generating steps, managing state, and more.

## Installation

The Mota CLI is automatically installed when you install the `mota` package. You can use it by running `npx mota` followed by the desired command.

## Commands

### `create`

Create a new Mota project.

```bash
npx mota create [options]
```

Options:

- `-n, --name <project name>`: The name for your project, used to create a directory. Use `.` or `./` to create it in the current directory.
- `-t, --template <template name>`: The Mota template to use for your project. Run `npx mota templates` to see available templates.
- `-c, --cursor`: Enable Cursor IDE integration by adding `.cursor` configuration folder

### `templates`

Print the list of available project templates.

```bash
npx mota templates
```

### `build`

Build your project, generating zip files for each step and creating a configuration file.

```bash
npx mota build
```

This command:

1. Compiles all your steps (both Node.js and Python)
2. Bundles each step into a zip file
3. Generates a `mota.steps.json` configuration file in the `dist` directory
4. Organizes the output in the `dist` directory

### `deploy`

Deploy your built steps to the Mota deployment service.

```bash
npx mota deploy [options]
```

Options:

- `-k, --api-key <key>` (required): Your API key for authentication
- `-e, --env <environment>`: The environment to deploy to (default: `dev`)
- `-v, --version <version>`: The version to deploy (default: `latest`)

Example:

```bash
npx mota deploy --api-key your-api-key-here --env production --version 1.0.0
```

The deployment process:

1. Uploads each zip file individually with its path information
2. Uploads the steps configuration from `mota.steps.json`
3. Starts the deployment process on the server
4. Generates deployment results in `dist/mota.deployments.json`
5. Creates a human-readable summary in `dist/mota.deployments.summary.json`

### `dev`

Start the development server.

```bash
npx mota dev [options]
```

Options:

- `-p, --port <port>`: The port to run the server on (default: 3000).
- `-H, --host [host]`: The host address for the server (default: localhost).
- `-v, --verbose`: Enable verbose logging.
- `-d, --debug`: Enable debug logging.

### `get-config`

Get the generated config for your project.

```bash
npx mota get-config [options]
```

Options:

- `-o, --output <path>`: Path to write the generated config file.

### `emit`

Emit an event to the Mota server.

```bash
npx mota emit [options]
```

Options:

- `--topic <topic>` (required): Event topic/type to emit.
- `--message <message>` (required): Event payload as a JSON string.
- `-p, --port <number>`: Port number (default: 3000).

### `generate`

Generate Mota resources.

#### `generate step`

Create a new step with interactive prompts.

```bash
npx mota generate step [options]
```

Options:

- `-d, --dir <step file path>`: The path relative to the steps directory to create the step file.

### `state`

Manage application state.

#### `state list`

List the current file state.

```bash
npx mota state list
```

## Debugging

You can enable debug logging by passing the `-d` or `--debug` flag to the `dev` command:

```bash
npx mota dev --debug
```

This will set the `LOG_LEVEL` environment variable to `'debug'`, providing more detailed logging output.

### `docker`

Tools to help you setup your Mota project with docker and run it inside a container.

#### `docker setup`

Setup your Mota project for Docker

```bash
npx mota docker setup
```

#### `docker build`

Build your Mota project Docker image

```bash
npx mota docker build
```

Options:

- `--project-name <project name>` (required): The name of your project.

#### `docker run`

Run your Mota project inside a container

```bash
npx mota docker run
```

Options:

- `--port <number>`: Port number (default: 3000).
- `--project-name <project name>` (required): The name of your project.
- `--skip-build`: Skip building the Docker image and used the last built image.

## Next Steps

- Explore the [Core Concepts](/docs/getting-started/core-concepts) to learn more about Steps, Flows, Events, and Topics.
- Check out the [Examples](/docs/examples) for common patterns and use cases.
- Join our [Community](/community) for help and discussions.
