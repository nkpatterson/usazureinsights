import { SweouInsightsPage } from './app.po';

describe('sweou-insights App', () => {
  let page: SweouInsightsPage;

  beforeEach(() => {
    page = new SweouInsightsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
