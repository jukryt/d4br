using Importer.Puppeteer;

namespace Importer.Processor
{
    internal class ProcessorRunner
    {
        private readonly PuppeteerBrowser _browser;
        private readonly SemaphoreSlim _processorSemaphore;

        public ProcessorRunner(PuppeteerBrowser browser, int maxProcessorCount)
        {
            _browser = browser;
            _processorSemaphore = new SemaphoreSlim(maxProcessorCount, maxProcessorCount);
        }

        public async Task ExecuteAsync(IResourceProcessor processor)
        {
            await _processorSemaphore.WaitAsync();
            await processor.ProcessAsync(_browser);
            _processorSemaphore.Release();
        }
    }
}
