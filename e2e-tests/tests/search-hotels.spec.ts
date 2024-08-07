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

test("should show hotel details", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going").fill("Nigeria");
  await page.getByRole("button", { name: "Search" }).click();

  await page.getByText("Named Hotel").click();
  await expect(page).toHaveURL(/detail/);
  await expect(page.getByRole("button", { name: "Book now" })).toBeVisible();
});

test("should book hotel", async ({ page }) => {
  await page.goto(UI_URL);

  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);

  await page.getByRole("button", { name: "Search" }).click();

  await page.getByText("Named Hotel").click();
  await page.getByRole("button", { name: "Book now" }).click();

  await expect(page.getByText("Total Cost: $666.00")).toBeVisible({
    timeout: 50000,
  });

  const stripFrame = page.frameLocator("iframe").first();
  await stripFrame
    .locator('[placeholder="Card number"]')
    .fill("4242424242424242");
  await stripFrame.locator('[placeholder="MM / YY"]').fill("10/25");
  await stripFrame.locator('[placeholder="CVC"]').fill("434");
  await stripFrame.locator('[placeholder="ZIP"]').fill("34234");

  await page.getByRole("button", { name: "Confirm Booking" }).click();
  await expect(page.getByText("Booking Saved")).toBeVisible({ timeout: 50000 });
});
