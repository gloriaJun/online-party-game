import { test, expect } from "@playwright/test";

test.describe("i18n Locale Switching", () => {
  test("defaults to English", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByLabel("Nickname")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Create Room" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Join Room" })
    ).toBeVisible();
  });

  test("switches to Korean via cookie", async ({ page, context }) => {
    await context.addCookies([
      {
        name: "NEXT_LOCALE",
        value: "ko",
        domain: "localhost",
        path: "/",
      },
    ]);
    await page.goto("/");
    await expect(page.getByText("닉네임")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "방 만들기" })
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "방 참여" })).toBeVisible();
    await expect(page.getByText("또는")).toBeVisible();
  });

  // Skipped: Turbopack dev mode intermittent 404 on dynamic routes
  test.skip("lobby page renders in Korean", async ({ page, context }) => {
    await context.addCookies([
      {
        name: "NEXT_LOCALE",
        value: "ko",
        domain: "localhost",
        path: "/",
      },
    ]);
    await page.goto("/lobby/ABCD23?nickname=Player1");
    await expect(page.getByText("게임 로비")).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByRole("button", { name: "초대 링크 복사" })
    ).toBeVisible();
  });

  test("switches locale via locale switcher UI", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Create Room" })
    ).toBeVisible();

    // Click the locale switcher globe button
    await page.getByRole("button", { name: "Change language" }).click();

    // Click Korean option
    await page.getByText("KO").click();

    // Page reloads with Korean locale
    await expect(
      page.getByRole("heading", { name: "방 만들기" })
    ).toBeVisible();
  });
});
