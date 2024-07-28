import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173/";

test("should allow the user to sign in", async ({ page }) => {
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
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});

test("should allow the user to register", async ({ page }) => {
  const testUser = Math.floor(Math.random() * 90000) + 10000;
  await page.goto(UI_URL);
  // get sign in button
  await page.getByRole("link", { name: "Sign In" }).click();
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.getByRole("link", { name: "Create an account here" }).click();
  await expect(
    page.getByRole("heading", { name: "Create an Account" })
  ).toBeVisible();

  // fill sin in form
  await page.locator("[name=firstName]").fill(`test_first${testUser}`);
  await page.locator("[name=lastName]").fill(`test_last${testUser}`);
  await page.locator("[name=email]").fill(`${testUser}mail@hotel.com`);
  await page.locator("[name=password]").fill("@Hotel1");
  await page.locator("[name=confirmPassword]").fill("@Hotel1");

  // click sign button
  await page.getByRole("button", { name: "Create Account" }).click();
  await expect(page.getByText("Registration Successful")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});
