namespace Importer.Extension
{
    internal static class SemaphoreExtension
    {
        public static async Task<IDisposable> WaitAndReleaseAsync(this SemaphoreSlim semaphore, CancellationToken cancellationToken = default)
        {
            await semaphore.WaitAsync(cancellationToken);
            return new SemaphoreReleser(semaphore);
        }

        private sealed class SemaphoreReleser : IDisposable
        {
            private readonly SemaphoreSlim _semaphore;

            public SemaphoreReleser(SemaphoreSlim semaphore)
            {
                _semaphore = semaphore;
            }

            public void Dispose()
            {
                _semaphore.Release();
            }
        }
    }
}
