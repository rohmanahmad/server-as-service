module.exports = { 
    List: function (config = {}) {   
        const { url } = config
        describe('PTBC - CRM Role List', () => {
            beforeAll(async () => {
                await page.goto(url)
            })

            it('should display "PTBC - CRM List Role" text on page', async () => {
                await expect(page).toMatch('Name Role')
            })
        })
    }
}