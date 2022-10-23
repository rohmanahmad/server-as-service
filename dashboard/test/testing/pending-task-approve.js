module.exports = { 
    Approve: function (config = {}) {
        const { url } = config
        describe('PTBC - CRM Pending Task Approve', () => {
            
            beforeAll(async () => {
              await page.goto(url)
            })
            
            it('should display "PTBC - CRM Pending Task Search " text on page', async () => {
                await expect(page).toFillForm('form[name="task-form"]', {
                  searchPendingTask: 'abdulrohman123',
                })
                await expect(page).toClick('button', { text: 'Search' })
            })
            
            it('should display "PTBC - CRM My Pending Tasks Approve" text on page', async () => {
              await expect(page).toClick('button', { text: 'Approve' })
            })
            
            it('should display "PTBC - CRM Success MESSAGE PREVIEW APPROVE" text on page', async () => {
              await expect(page).toMatch('message preview approve')
            })
            
            it('should display "PTBC - CRM My Pending Tasks Approve Comfirm" text on page', async () => {
              await expect(page).toClick('a', { text: 'Approve' })
            })

            // it('should display "PTBC - CRM Success Approved " text on page', async () => {
            //   await expect(page).toMatch('Success Approved Button')
            // })
          
            it('should display "PTBC - CRM Success Approved Ok " text on page', async () => {
              await expect(page).toClick('button', { text: 'OK' })
            })

            // it('should display "PTBC - CRM debug" text on page', async () => {
            //   await jestPuppeteer.debug()
            // })

          })
    }
}