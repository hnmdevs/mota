#!/usr/bin/env python3

with open('/workspace/packages/docs/lib/fetchAgents.ts', 'r') as f:
    lines = f.readlines()

# Find the line with "const result: AgentData = { steps: {}, services: {} }"
for i, line in enumerate(lines):
    if 'const result: AgentData = { steps: {}, services: {} }' in line:
        # Insert the guard clause after this line
        lines.insert(i + 1, '  \n')
        lines.insert(i + 2, '  // Skip API calls if GitHub API base is a placeholder\n')
        lines.insert(i + 3, '  if (GITHUB_API_BASE === "#") {\n')
        lines.insert(i + 4, '    return result\n')
        lines.insert(i + 5, '  }\n')
        break

with open('/workspace/packages/docs/lib/fetchAgents.ts', 'w') as f:
    f.writelines(lines)

print("Fixed fetchAgents.ts")