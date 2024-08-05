import { test, expect } from "@playwright/test";
const UI_URL = "http://localhost:5173/";

// signin user
test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);
  // get sign in button
  await page.getByRole("link", { name: "Sign In" }).click();
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  // fill sin in form
  await page.locator("[name=email]").fill("support@scelloo.com");
  await page.locator("[name=password]").fill("@Hotel1");

  // click sign button
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText("Sign in Successful! ")).toBeVisible();
});

test("should show hotel search results", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going").fill("Nigeria");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("Hotels found in Nigeria")).toBeVisible();
  await expect(page.getByText("Named Hotel")).toBeVisible();
});
