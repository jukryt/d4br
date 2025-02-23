using PuppeteerSharp;

namespace Importer.Puppeteer
{
    internal class PuppeteerBrowser : IDisposable
    {
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
        private IBrowser _browser;
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.

        private bool _isRunning;

        public async Task RunAsync(CancellationToken cancellationToken = default)
        {
            if (cancellationToken.IsCancellationRequested)
                return;

            if (_isRunning)
                return;

            // Download browser if need.
            await new BrowserFetcher().DownloadAsync();

            var launchOptions = CreateLaunchOptions();
            _browser = await PuppeteerSharp.Puppeteer.LaunchAsync(launchOptions);

            _isRunning = true;
        }

        public async Task<IPage> NewPageAsync()
        {
            var page = await _browser.NewPageAsync();
            page.DefaultNavigationTimeout = Static.BrowserRequestTimeout;
            return page;
        }

        private LaunchOptions CreateLaunchOptions()
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
                DefaultViewport = new ViewPortOptions { Width = 958, Height = 918 } // Половина экрана 1080p
            };
        }

        public void Dispose()
        {
            try
            {
                _browser?.Dispose();
            }
            finally
            {
                _isRunning = false;
            }
        }
    }
}
