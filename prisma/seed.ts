import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { IngredientType } from "../src/generated/prisma/enums";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    console.log("🌱 Start seeding...");

    // --------------------------------------------------
    // Drinks
    // --------------------------------------------------

    const drinks = [
        {
            id: "coffee",
            name: "Coffee",
        },
        {
            id: "tea",
            name: "Tea",
        },
        {
            id: "milk",
            name: "Milk",
        },
    ];

    for (const drink of drinks) {
        await prisma.drink.upsert({
            where: {
                id: drink.id,
            },
            update: {
                name: drink.name,
                isActive: true,
            },
            create: {
                id: drink.id,
                name: drink.name,
                isActive: true,
            },
        });
    }

    // --------------------------------------------------
    // Sizes
    // --------------------------------------------------

    const sizes = [
        {
            id: "small",
            name: "Small",
        },
        {
            id: "medium",
            name: "Medium",
        },
        {
            id: "large",
            name: "Large",
        },
    ];

    for (const size of sizes) {
        await prisma.size.upsert({
            where: {
                id: size.id,
            },
            update: {
                name: size.name,
                isActive: true,
            },
            create: {
                id: size.id,
                name: size.name,
                isActive: true,
            },
        });
    }

    // --------------------------------------------------
    // Drink + Size Pricing
    // --------------------------------------------------

    const drinkSizes = [
        // Coffee
        {
            id: "coffee-small",
            drinkId: "coffee",
            sizeId: "small",
            price: 40,
        },
        {
            id: "coffee-medium",
            drinkId: "coffee",
            sizeId: "medium",
            price: 50,
        },
        {
            id: "coffee-large",
            drinkId: "coffee",
            sizeId: "large",
            price: 60,
        },

        // Tea
        {
            id: "tea-small",
            drinkId: "tea",
            sizeId: "small",
            price: 35,
        },
        {
            id: "tea-medium",
            drinkId: "tea",
            sizeId: "medium",
            price: 45,
        },
        {
            id: "tea-large",
            drinkId: "tea",
            sizeId: "large",
            price: 55,
        },

        // Milk
        {
            id: "milk-small",
            drinkId: "milk",
            sizeId: "small",
            price: 30,
        },
        {
            id: "milk-medium",
            drinkId: "milk",
            sizeId: "medium",
            price: 40,
        },
        {
            id: "milk-large",
            drinkId: "milk",
            sizeId: "large",
            price: 50,
        },
    ];

    for (const drinkSize of drinkSizes) {
        await prisma.drinkSize.upsert({
            where: {
                id: drinkSize.id,
            },
            update: {
                drinkId: drinkSize.drinkId,
                sizeId: drinkSize.sizeId,
                price: drinkSize.price,
            },
            create: {
                id: drinkSize.id,
                drinkId: drinkSize.drinkId,
                sizeId: drinkSize.sizeId,
                price: drinkSize.price,
            },
        });
    }

    // --------------------------------------------------
    // Syrups
    // --------------------------------------------------

    const syrups = [
        {
            id: "vanilla",
            name: "Vanilla",
            price: 10,
        },
        {
            id: "caramel",
            name: "Caramel",
            price: 12,
        },
        {
            id: "chocolate",
            name: "Chocolate",
            price: 15,
        },
    ];

    for (const syrup of syrups) {
        await prisma.ingredient.upsert({
            where: {
                id: syrup.id,
            },
            update: {
                name: syrup.name,
                type: IngredientType.SYRUP,
                price: syrup.price,
                isActive: true,
            },
            create: {
                id: syrup.id,
                name: syrup.name,
                type: IngredientType.SYRUP,
                price: syrup.price,
                isActive: true,
            },
        });
    }

    // --------------------------------------------------
    // Toppings
    // --------------------------------------------------

    const toppings = [
        {
            id: "whipped-cream",
            name: "Whipped Cream",
            price: 10,
        },
        {
            id: "cinnamon",
            name: "Cinnamon",
            price: 5,
        },
        {
            id: "marshmallows",
            name: "Marshmallows",
            price: 12,
        },
    ];

    for (const topping of toppings) {
        await prisma.ingredient.upsert({
            where: {
                id: topping.id,
            },
            update: {
                name: topping.name,
                type: IngredientType.TOPPING,
                price: topping.price,
                isActive: true,
            },
            create: {
                id: topping.id,
                name: topping.name,
                type: IngredientType.TOPPING,
                price: topping.price,
                isActive: true,
            },
        });
    }

    console.log("✅ Seeding completed successfully");
}

main()
    .catch((error) => {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });