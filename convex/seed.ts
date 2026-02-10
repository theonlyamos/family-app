import { mutation } from "./_generated/server";

export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        // Check if data already exists
        const existingMembers = await ctx.db.query("members").take(1);
        if (existingMembers.length > 0) {
            return "Database already seeded. Skipping.";
        }

        // --- Members ---
        const john = await ctx.db.insert("members", {
            firstName: "John",
            lastName: "Miller",
            aliases: ["Johnny", "J.R."],
            dateOfBirth: "1985-03-15",
            placeOfBirth: "Chicago, Illinois",
            placeOfResidence: "Seattle, Washington",
            phoneNumbers: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
            emailAddresses: ["john@millerfamily.com", "john.work@email.com"],
            education: "Bachelor's in Computer Science, University of Washington",
            occupation: "Senior Software Engineer at Microsoft",
            gender: "male",
            bio: "John is the head of the family. He loves hiking, photography, and spending time with his kids.",
        });

        const jane = await ctx.db.insert("members", {
            firstName: "Jane",
            lastName: "Miller",
            aliases: ["Janie"],
            dateOfBirth: "1987-07-22",
            placeOfBirth: "Portland, Oregon",
            placeOfResidence: "Seattle, Washington",
            phoneNumbers: ["+1 (555) 123-4568"],
            emailAddresses: ["jane@millerfamily.com"],
            education: "Master's in Education, Stanford University",
            occupation: "Elementary School Teacher",
            gender: "female",
            bio: "Jane is a dedicated teacher and loving mother. She enjoys gardening and yoga.",
        });

        // Set spouse references
        await ctx.db.patch(john, { spouseId: jane });
        await ctx.db.patch(jane, { spouseId: john });

        const sam = await ctx.db.insert("members", {
            firstName: "Sam",
            lastName: "Miller",
            dateOfBirth: "2010-11-08",
            placeOfBirth: "Seattle, Washington",
            placeOfResidence: "Seattle, Washington",
            phoneNumbers: [],
            emailAddresses: ["sam@millerfamily.com"],
            education: "8th Grade",
            occupation: "Student",
            gender: "male",
            bio: "Sam loves soccer and video games. He's on the school soccer team.",
            fatherId: john,
            motherId: jane,
        });

        const emily = await ctx.db.insert("members", {
            firstName: "Emily",
            lastName: "Miller",
            aliases: ["Emmy"],
            dateOfBirth: "2013-04-12",
            placeOfBirth: "Seattle, Washington",
            placeOfResidence: "Seattle, Washington",
            phoneNumbers: [],
            emailAddresses: ["emily@millerfamily.com"],
            education: "5th Grade",
            occupation: "Student",
            gender: "female",
            bio: "Emily loves art, dancing, and playing with her friends.",
            fatherId: john,
            motherId: jane,
        });

        // --- Events ---
        await ctx.db.insert("events", {
            title: "Family Dinner",
            description: "Monthly family gathering with grandparents",
            startTime: "2026-12-01T18:00:00Z",
            endTime: "2026-12-01T21:00:00Z",
            location: "Grandma's House",
            createdBy: john,
            type: "family",
        });

        await ctx.db.insert("events", {
            title: "John's Birthday",
            description: "Celebrate John's 12th birthday",
            startTime: "2026-12-15T14:00:00Z",
            endTime: "2026-12-15T18:00:00Z",
            location: "Our Home",
            createdBy: jane,
            type: "family",
        });

        await ctx.db.insert("events", {
            title: "Soccer Practice",
            startTime: "2026-12-10T16:00:00Z",
            endTime: "2026-12-10T18:00:00Z",
            location: "Community Field",
            createdBy: john,
            type: "kids",
        });

        // --- Investments ---
        await ctx.db.insert("investments", {
            name: "Apple Inc.",
            type: "stock",
            amount: 15000.5,
            date: "2026-01-15",
            notes: "Tech sector allocation",
            change: 34.2,
        });

        await ctx.db.insert("investments", {
            name: "Bitcoin",
            type: "crypto",
            amount: 8500.0,
            date: "2026-03-10",
            change: -5.8,
        });

        await ctx.db.insert("investments", {
            name: "Rental Property A",
            type: "real_estate",
            amount: 250000.0,
            date: "2025-06-01",
            change: 12.4,
        });

        await ctx.db.insert("investments", {
            name: "Vanguard ETF",
            type: "stock",
            amount: 45000.0,
            date: "2025-11-20",
            change: 8.7,
        });

        // --- Activities ---
        await ctx.db.insert("activities", {
            action: "Added new member",
            item: "Emily Miller",
            type: "member",
            memberId: emily,
        });

        await ctx.db.insert("activities", {
            action: "Uploaded document",
            item: "Home Insurance Policy",
            type: "document",
        });

        await ctx.db.insert("activities", {
            action: "Event scheduled",
            item: "Family Reunion",
            type: "event",
        });

        await ctx.db.insert("activities", {
            action: "Investment updated",
            item: "Apple Inc. shares",
            type: "investment",
        });

        return "Database seeded successfully!";
    },
});
