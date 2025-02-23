using Importer.Logger;

namespace Importer
{
    internal static class Static
    {
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
        private static AppConfig AppConfig;
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.

        public static string WorkFolder => AppConfig.WorkFolder;
        public static int BrowserRequestTimeout => AppConfig.BrowserRequestTimeout;

        public static ILogger Logger => CreateLogger();

        public static void Init(AppConfig config)
        {
            AppConfig = config;
        }

        private static ILogger CreateLogger()
        {
            return new CombineLogger(
#if DEBUG
                new DebugLogger(true, true),
#endif
                new ConsoleLogger(true, false)
            );
        }
    }
}
