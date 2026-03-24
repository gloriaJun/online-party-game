import { test, expect } from "@playwright/test";

// Room code chars exclude I, O, 0, 1 — use only valid chars
const VALID_ROOM_CODE = "ABCD23";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders all sections", async ({ page }) => {
    await expect(page.getByLabel("Nickname")).toBeVisible();
    await expect(page.getByRole("button", { name: "Create Room" })).toBeVisible();
    await expect(page.getByLabel("Room Code")).toBeVisible();
    await expect(page.getByRole("button", { name: "Join Room" })).toBeVisible();
    await expect(page.getByText("OR")).toBeVisible();
  });

  test("create and join buttons are disabled without nickname", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Create Room" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Join Room" })).toBeDisabled();
  });

  test("create room button enables with nickname", async ({ page }) => {
    await page.getByLabel("Nickname").fill("Player1");
    await expect(page.getByRole("button", { name: "Create Room" })).toBeEnabled();
  });

  test("create room navigates to lobby", async ({ page }) => {
    await page.getByLabel("Nickname").fill("Player1");
    await page.getByRole("button", { name: "Create Room" }).click();
    await expect(page).toHaveURL(/\/lobby\/[A-Z0-9]{6}\?nickname=Player1/);
  });

  test("join room requires both nickname and valid room code", async ({ page }) => {
    const joinButton = page.getByRole("button", { name: "Join Room" });

    // No nickname, no code
    await expect(joinButton).toBeDisabled();

    // Nickname only
    await page.getByLabel("Nickname").fill("Player1");
    await expect(joinButton).toBeDisabled();

    // Nickname + partial code
    await page.getByLabel("Room Code").pressSequentially("ABC");
    await expect(joinButton).toBeDisabled();

    // Nickname + full 6-char code
    await page.getByLabel("Room Code").fill("");
    await page.getByLabel("Room Code").pressSequentially(VALID_ROOM_CODE);
    await expect(joinButton).toBeEnabled();
  });

  test("join room navigates to lobby with valid code", async ({ page }) => {
    await page.getByLabel("Nickname").fill("Player1");
    await page.getByLabel("Room Code").pressSequentially(VALID_ROOM_CODE);
    await page.getByRole("button", { name: "Join Room" }).click();
    await expect(page).toHaveURL(
      new RegExp(`/lobby/${VALID_ROOM_CODE}\\?nickname=Player1`)
    );
  });

  test("room code input auto-uppercases", async ({ page }) => {
    await page.getByLabel("Room Code").pressSequentially("abcd23");
    await expect(page.getByLabel("Room Code")).toHaveValue("ABCD23");
  });

  test("room code auto-fills from URL query param", async ({ page }) => {
    await page.goto(`/?roomCode=${VALID_ROOM_CODE}`);
    await expect(page.getByLabel("Room Code")).toHaveValue(VALID_ROOM_CODE);
  });
});
