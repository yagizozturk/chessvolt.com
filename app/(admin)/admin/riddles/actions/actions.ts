"use server";

import {
  bulkCreateRiddlesAction as bulkCreateRiddlesActionImpl,
  bulkCreateRiddlesFormAction as bulkCreateRiddlesFormActionImpl,
} from "./bulk-create-riddles-action";
import { createRiddleAction as createRiddleActionImpl } from "./create-riddle-action";
import { deleteRiddleAction as deleteRiddleActionImpl } from "./delete-riddle-action";
import { updateRiddleAction as updateRiddleActionImpl } from "./update-riddle-action";

export async function createRiddleAction(formData: FormData) {
  return createRiddleActionImpl(formData);
}

export async function updateRiddleAction(id: string, formData: FormData) {
  return updateRiddleActionImpl(id, formData);
}

export async function bulkCreateRiddlesAction(jsonData: string, returnPath = "/admin/riddles/bulk") {
  return bulkCreateRiddlesActionImpl(jsonData, returnPath);
}

export async function bulkCreateRiddlesFormAction(formData: FormData) {
  return bulkCreateRiddlesFormActionImpl(formData);
}

export async function deleteRiddleAction(id: string): Promise<void> {
  return deleteRiddleActionImpl(id);
}
