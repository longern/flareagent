import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Tool {
  id: string;
  definition: string;
  enabled?: boolean;
}

export const toolsSlice = createSlice({
  name: "tools",
  initialState: {
    tools: null as Record<string, Tool> | null,
  },
  reducers: {
    setTools(state, action: PayloadAction<Tool[]>) {
      state.tools = Object.fromEntries(
        action.payload.map((memory) => [memory.id, memory])
      );
    },
    createTool(state, action: PayloadAction<Tool>) {
      state.tools[action.payload.id] = action.payload;
    },
    deleteTool(state, action: PayloadAction<string>) {
      delete state.tools[action.payload];
    },
    toggleTool(state, action: PayloadAction<{ id: string; enabled: boolean }>) {
      const { id, enabled } = action.payload;
      state.tools[id].enabled = enabled;
    },
  },
});

export const fetchTools = createAsyncThunk(
  "tools/fetchTools",
  async (_, { dispatch }) => {
    await import("../tools/scheme");
    const response = await fetch("tool://");
    const data = await response.json<{
      tools: { id: string; definition_url: string }[];
    }>();
    const toolsResult = await Promise.allSettled(
      data.tools.map(async ({ id, definition_url: url }) => {
        const response = await fetch(url);
        const definition = await response.text();
        return { id, definition };
      })
    );
    const tools = toolsResult
      .map((result) => {
        return result.status === "fulfilled" ? result.value : null;
      })
      .filter((tool) => tool !== null);
    dispatch(setTools(tools));
  }
);

export const { setTools, createTool, deleteTool, toggleTool } =
  toolsSlice.actions;

export default toolsSlice.reducer;