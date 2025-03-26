using PuppeteerSharp;

namespace Importer.Puppeteer
{
    internal class PuppeteerBrowser : IDisposable
    {
        public static async Task<PuppeteerBrowser> RunAsync(int maxPageCount)
        {
            // Download browser if need.
            await new BrowserFetcher().DownloadAsync();

            var launchOptions = CreateLaunchOptions();
            var browser = await PuppeteerSharp.Puppeteer.LaunchAsync(launchOptions);

            return new PuppeteerBrowser(browser, maxPageCount);
        }

        private static LaunchOptions CreateLaunchOptions()
        {
            var args = new[]
            {
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-web-security",
                "--disable-infobars",
                "--window-position=0,0",
                "--ignore-certifcate-errors",
                "--ignore-certifcate-errors-spki-list",
                "--user-agent=\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36\""
            };

            return new LaunchOptions
            {
                Args = args,
                Headless = true,
                Timeout = Static.BrowserRequestTimeout,
                DefaultViewport = new ViewPortOptions { Width = 958, Height = 918 }
            };
        }

        private readonly IBrowser _browser;
        private readonly SemaphoreSlim _pageSemaphore;

        private PuppeteerBrowser(IBrowser browser, int maxPageCount)
        {
            _browser = browser;
            _pageSemaphore = new SemaphoreSlim(maxPageCount, maxPageCount);
        }

        public async Task<IPage> NewPageAsync()
        {
            await _pageSemaphore.WaitAsync();

            var page = await _browser.NewPageAsync();
            page.DefaultNavigationTimeout = Static.BrowserRequestTimeout;
            page.Close += PageClose;

            return page;
        }

        private void PageClose(object? sender, EventArgs e)
        {
            if (sender is IPage page)
                page.Close -= PageClose;

            _pageSemaphore.Release();
        }

        public void Dispose()
        {
            _browser.Dispose();
        }
    }
}
