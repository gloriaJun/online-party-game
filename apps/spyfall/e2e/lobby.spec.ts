import { test, expect } from "@playwright/test";

const VALID_ROOM_CODE = "ABCD23";

// Lobby tests are skipped in Turbopack dev mode due to intermittent 404
// on dynamic routes. They pass with `next start` (production build).
// TODO: Re-enable when CI uses production builds.
test.describe.skip("Lobby Page", () => {
  test("renders room code and waiting message", async ({ page }) => {
    await page.goto(`/lobby/${VALID_ROOM_CODE}?nickname=Player1`);
    await expect(page.getByRole("heading", { name: "Game Lobby" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(VALID_ROOM_CODE)).toBeVisible();
    await expect(page.getByText("Waiting for players to join")).toBeVisible();
  });

  test("copy invite link button works", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto(`/lobby/${VALID_ROOM_CODE}?nickname=Player1`);

    const copyButton = page.getByRole("button", { name: "Copy Invite Link" });
    await expect(copyButton).toBeVisible({ timeout: 10000 });
    await copyButton.click();

    // Button text changes to "Link Copied!"
    await expect(page.getByRole("button", { name: "Link Copied!" })).toBeVisible();

    // Verify clipboard content
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain(`/games/spyfall?roomCode=${VALID_ROOM_CODE}`);

    // Button text reverts after 2 seconds
    await expect(page.getByRole("button", { name: "Copy Invite Link" })).toBeVisible({
      timeout: 3000,
    });
  });

  test("invite link leads to landing with auto-filled room code", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto(`/lobby/${VALID_ROOM_CODE}?nickname=Host`);

    // Wait for client hydration
    const copyButton = page.getByRole("button", { name: "Copy Invite Link" });
    await expect(copyButton).toBeVisible({ timeout: 10000 });

    // Copy invite link
    await copyButton.click();
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());

    // Navigate to the invite link (extract path from full URL)
    const url = new URL(clipboardText);
    await page.goto(url.pathname + url.search);

    // Room code should be auto-filled
    await expect(page.getByLabel("Room Code")).toHaveValue(VALID_ROOM_CODE);
  });
});
