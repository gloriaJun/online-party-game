import { test, expect } from "@playwright/test";

const VALID_ROOM_CODE = "ABCD23";
const TEST_NICKNAME = "Player1";
const TEST_PLAYER_ID = "test-player-id";

// Lobby tests require a running Supabase instance and production build.
// Skipped in CI dev mode. Run with: pnpm --filter spyfall test:e2e
test.describe.skip("Lobby Page", () => {
  const lobbyUrl = `/lobby/${VALID_ROOM_CODE}?nickname=${TEST_NICKNAME}&playerId=${TEST_PLAYER_ID}`;

  test("renders lobby title and player nickname", async ({ page }) => {
    await page.goto(lobbyUrl);
    await expect(page.getByRole("heading", { name: "Game Lobby" })).toBeVisible(
      { timeout: 10000 }
    );
    await expect(page.getByText(`Joined as ${TEST_NICKNAME}`)).toBeVisible();
  });

  test("displays room code in share section", async ({ page }) => {
    await page.goto(lobbyUrl);
    await expect(page.getByText(VALID_ROOM_CODE)).toBeVisible({
      timeout: 10000,
    });
  });

  test("shows player list section", async ({ page }) => {
    await page.goto(lobbyUrl);
    await expect(page.getByText("Players")).toBeVisible({ timeout: 10000 });
  });

  test("shows game settings section", async ({ page }) => {
    await page.goto(lobbyUrl);
    await expect(page.getByText("Game Settings")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByLabel("Spy Count")).toBeVisible();
    await expect(page.getByLabel("Timer")).toBeVisible();
  });

  test("copy invite link button works", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto(lobbyUrl);

    const copyButton = page.getByRole("button", { name: "Copy Invite Link" });
    await expect(copyButton).toBeVisible({ timeout: 10000 });
    await copyButton.click();

    await expect(
      page.getByRole("button", { name: "Link Copied!" })
    ).toBeVisible();

    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText()
    );
    expect(clipboardText).toContain(
      `/games/spyfall?roomCode=${VALID_ROOM_CODE}`
    );
  });

  test("start game button shows min-player warning when host", async ({
    page,
  }) => {
    // Navigate as host (playerId matches room's host_player_id)
    await page.goto(lobbyUrl);
    // With fewer than 4 players, button should be disabled and show warning
    const startButton = page.getByRole("button", { name: "Start Game" });
    await expect(startButton).toBeVisible({ timeout: 10000 });
    await expect(startButton).toBeDisabled();
    await expect(page.getByText("Need at least 4 players")).toBeVisible();
  });

  test("redirects to landing if no nickname/playerId", async ({ page }) => {
    await page.goto(`/lobby/${VALID_ROOM_CODE}`);
    await page.waitForURL(/roomCode=ABCD23/);
  });
});
