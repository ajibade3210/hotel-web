import { test, expect } from "@playwright/test";
import path from "path";
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

test("should allow user add a hotel", async ({ page }) => {
  await page.goto(`${UI_URL}add-hotel`);

  await page.locator('[name="name"]').fill("Test Hotel");
  await page.locator('[name="city"]').fill("Test CityCity");
  await page.locator('[name="country"]').fill("Test Country");
  await page.locator('[name="description"]').fill("Test Desc");
  await page.locator('[name="adultCount"]').fill("2");
  await page.locator('[name="childCount"]').fill("0");
  await page.locator('[name="pricePerNight"]').fill("100");

  await page.selectOption('select[name="starRating"]', "3");

  await page.getByText("Budget").click();

  await page.getByLabel("Free Wifi").click();
  await page.getByLabel("Parking").click();

  await page.setInputFiles('[name="imageFile"]', [
    path.join(__dirname, "files", "dubler-hq.jpg"),
    path.join(__dirname, "files", "rogue.jpg"),
  ]);

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel Saved!")).toBeVisible({ timeout: 50000 });
});

test("should display hotels", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await expect(page.getByText("Lorem Ipsum is simply dummy")).toBeVisible();
  await expect(page.getByText("Nigeria")).toBeVisible();
  await expect(page.getByText("Lagos")).toBeVisible();
  await expect(page.getByText("$222 per night")).toBeVisible();
  await expect(page.getByText("1 adults, 1 children")).toBeVisible();
  await expect(page.getByText("1 Star Rating")).toBeVisible();

  // await expect(page.getByRole("link", { name: "View Details" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();
});

test("should edit hotel details", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await page.getByRole("link", { name: "View Details" }).first().click({ timeout: 50000 });

  await page.waitForSelector('[name="name"]', { state: "attached" });
  await expect(page.locator('[name="name"]')).toHaveValue("Named Hotel");
  await page.locator('[name="name"]').fill("Named Hotel UPDATED");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel updated successfully!!")).toBeVisible();

  // Revert
  await page.reload()
  await page.waitForSelector('[name="name"]', { state: "attached" });
  await expect(page.locator('[name="name"]')).toHaveValue(
    "Named Hotel UPDATED"
  );
  await page.locator('[name="name"]').fill("Named Hotel");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel updated successfully!!")).toBeVisible();
});
