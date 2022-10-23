module.exports = { 
    List: function (config = {}) {   
        const { url } = config
        describe('PTBC - CRM User Access List', () => {
            beforeAll(async () => {
                await page.goto(url)
            })

            it('should display "PTBC - CRM List User Access" text on page', async () => {
                await expect(page).toMatch('User Id')
            })
        })
    }
}