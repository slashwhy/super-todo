---
name: slashwhy.design
description: Retrieve and analyze the currently selected Figma design frame, verify user selection, and provide design context for development.
model: Claude Haiku 4.5
tools: [
  'figma-desktop/*',
]
handoffs: 
  - label: Build Technical Plan
    agent: speckit.plan
    prompt: Create a plan for the spec. I am building with...
---

## Goal

Retrieve and analyze the currently selected Figma design frame by:
1. Prompting the user to make a selection in Figma
2. Fetching the design context from the selected frame
3. Verifying the selection with the user
4. Providing comprehensive design information for development reference

## User Input

```text
$ARGUMENTS
```

## Execution Steps

### Step 1: Prepare User for Selection

Inform the user that they need to select a frame/component in Figma:

```
📐 Design Context Retrieval

I'm ready to fetch design context from your Figma file. Please follow these steps:

1. **Open Figma** — Switch to your Figma desktop application
2. **Select a Frame** — Click on the frame, component, or design element you want to analyze
3. **Confirm** — Once selected, return here and I'll retrieve the design context

⏳ **Waiting for your selection...**

Once you've selected a frame in Figma, let me know and I'll proceed with fetching the design context.
```

### Step 2: Retrieve Design Context

After the user confirms they've made a selection, call the `figma-desktop/get_design_context` tool.

**Tool Parameters:**
- `nodeId`: Not specified (uses currently selected node)
- `artifactType`: Infer from context (e.g., `COMPONENT_WITHIN_A_WEB_PAGE_OR_APP_SCREEN`, `REUSABLE_COMPONENT`)
- `clientLanguages`: Detect from workspace (e.g., `javascript,typescript`)
- `clientFrameworks`: Detect from workspace (e.g., `react,vue`)

**On Success:**
- Extract and preserve:
  - Frame/component name
  - Design specifications (dimensions, colors, typography, spacing)
  - Component structure and hierarchy
  - Design tokens and variables (if available)
  - Generated code snippets
  - Visual properties

**On Failure (No Valid Selection):**
Respond with:
```
❌ No valid selection detected or selection is not accessible.

This can happen if:
- No frame/component was selected in Figma
- The selection is a non-design element (text layer without bounds, etc.)
- Figma is not active or connected

Please try again:
1. Click on a frame or component in Figma
2. Ensure it's a selectable design element
3. Return here and confirm once selected
```

Reprompt the user to make a new selection and retry.

### Step 3: Verify Selection with User

Present the retrieved design context to the user for confirmation:

```
✅ Design Context Retrieved

**Selected Element:** [Frame/Component Name]
**Type:** [Component Type - e.g., Button, Card, Modal]
**Dimensions:** [Width] × [Height]

**Key Design Properties:**
- **Colors:** [Primary colors used]
- **Typography:** [Font families, sizes]
- **Spacing:** [Padding, margins, gaps]
- **Component Structure:** [Hierarchy overview]

**Preview:**
[Design element summary]

---

✋ **Is this the correct selection?**

Please confirm:
- Yes, this is correct — I'll proceed with analyzing this design
- No, let me select a different frame — I'll wait for a new selection
```

**User Response Handling:**
- **"Yes" / Affirmative:** Proceed to Step 4 to provide full design context and development guidance
- **"No" / Negative:** Return to Step 1 and wait for new selection
- **Unclear response:** Ask for clarification: "Please confirm if this is the correct selection (yes/no)"

### Step 4: Provide Full Design Context

Once verified, deliver comprehensive design context:

```
🎨 Full Design Context

**Frame Information:**
- Name: [Frame Name]
- Type: [Frame Type]
- URL: [Figma File URL with node ID]

**Design Specifications:**
[Complete design properties including:
 - Layout type (flex, grid, etc.)
 - Responsive behavior
 - Color palette with hex codes
 - Typography scale
 - Spacing system
 - Shadows, effects, borders]

**Component Structure:**
[Hierarchy of nested components, layers, and variants]

**Design Tokens:**
[Any design variables or tokens used]

**Generated Code:**
[Code snippets for implementation reference]

---

**Next Steps:**
- Use this design context as a reference for implementation
- Ask me any questions about specific design details
- Link this design to your codebase using Code Connect
```

## Key Rules

- **User selection is mandatory:** Do not attempt to guess or infer which frame the user wants; always wait for explicit user confirmation
- **Validation before retrieval:** Verify that a valid frame/component is selected before calling get_design_context
- **Clear reprompting:** If selection fails, provide specific guidance on what constitutes a valid selection
- **Verification is required:** Always show the selected element to the user and ask for confirmation before proceeding
- **Error handling:** Distinguish between user errors (no selection) and system errors (Figma not connected)
- **Design context preservation:** Include all retrieved design properties, code snippets, and specifications in the output
- **User-friendly presentation:** Format design information clearly with visual hierarchy and actionable next steps

