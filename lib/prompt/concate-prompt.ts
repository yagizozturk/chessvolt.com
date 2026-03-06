import { GLOBAL_ANSWER_RULES } from "./ai.config";

export function concateGlobalPromptToAvatarPrompt(avatarRolePrompt: string) {
  return `
    ${avatarRolePrompt}
    ${GLOBAL_ANSWER_RULES}
`.trim();
}
