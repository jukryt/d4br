﻿using Importer.Logger;
using Importer.Model;
using Importer.Puppeteer;

namespace Importer
{
    internal class Program
    {
        static async Task Main(string[] args)
        {
            var appConfig = await AppConfig.LoadAsync();
            Static.Init(appConfig);
            AppDomain.CurrentDomain.UnhandledException += UnhandledExceptionTrapper;

            var cancellationTokenSource = new CancellationTokenSource();
            await ExecuteAsync(Static.Logger, cancellationTokenSource.Token);
        }

        private static async Task ExecuteAsync(ILogger logger, CancellationToken cancellationToken)
        {
            using var browser = new PuppeteerBrowser();
            await browser.RunAsync(cancellationToken);

            logger.WriteMessage("Begin");

            var chunks = Resources.GetResources()
                .SelectMany(c => c.Infos.Select(i => new Resource(i, c.Folder)))
                .Chunk(5);

            foreach (var chunk in chunks)
            {
                var tasks = new List<Task>();
                foreach (var resource in chunk)
                {
                    var processor = resource.Info.CreateProcessor(resource.Folder, logger);
                    tasks.Add(processor.ProcessAsync(browser));
                }
                await Task.WhenAll(tasks);
            }

            logger.WriteMessage("Complete");
        }        

        private static void UnhandledExceptionTrapper(object sender, UnhandledExceptionEventArgs args)
        {
            var source = $"{nameof(Program)}.{nameof(UnhandledExceptionTrapper)}";
            var exception = (Exception)args.ExceptionObject;
            Static.Logger.WriteException(exception, source);
        }

        public sealed class Resource
        {
            public Resource(IResourceInfo info, string folder)
            {
                Info = info;
                Folder = folder;
            }

            public IResourceInfo Info { get; }
            public string Folder { get; }
        }
    }
}
