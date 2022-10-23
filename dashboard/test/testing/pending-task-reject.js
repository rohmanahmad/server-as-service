module.exports = { 
    Reject: function (config = {}) {   
        const { url } = config
        describe('PTBC - CRM Pending Task Reject', () => {
            beforeAll(async () => {
                await page.goto(url)
            })

            it('should display "PTBC - CRM Pending Task Search " text on page', async () => {
                await expect(page).toFillForm('form[name="task-form"]', {
                  searchPendingTask: 'abdulrohman123',
                })
                await expect(page).toClick('button', { text: 'Search' })
            })

            it('should display "PTBC - CRM My Pending Tasks Reject" text on page', async () => {
                await expect(page).toClick('button', { text: 'Reject' })
            })
            
            it('should display "PTBC - CRM Success Message Preview Reject" text on page', async () => {
                await expect(page).toMatch('message preview reject')
            })
            
            it('should display "PTBC - CRM My Pending Tasks Reject Comfirm" text on page', async () => {
                await expect(page).toClick('a', { text: 'Reject' })
            })
            
            // it('should display "PTBC - CRM Success Reject " text on page', async () => {
            //     await expect(page).toMatch('Success Reject Button')
            // })
            
            it('should display "PTBC - CRM Success Reject Ok " text on page', async () => {
                await expect(page).toClick('button', { text: 'OK' })
            })
        })
    }
}