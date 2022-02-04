const cl = console.log;

const { CookieStore } = ImmortalDB;
const { ImmortalStorage } = ImmortalDB;
(async () => {
    // Test cookie-only storage.
    // const cookieStore = await new CookieStore()
    // const db = await new ImmortalStorage([cookieStore])

    // Test all stores.
    const db = ImmortalDB.ImmortalDB;

    await db.remove('hi');
    await db.set('hi', 'lolsup');

    cl('val', await db.get('hi'));
})();
