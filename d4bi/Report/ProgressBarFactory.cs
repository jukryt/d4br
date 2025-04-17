using ShellProgressBar;

namespace Importer.Report
{
    internal static class ProgressBarFactory
    {
        public static ProgressBar CreateProgressBar(string name)
        {
            var options = new ProgressBarOptions
            {
                DisplayTimeInRealTime = false,
                ProgressBarOnBottom = true,
                EnableTaskBarProgress = true,
                DisablePercentageAtZeroMaxTicks = true,
                ForegroundColor = ConsoleColor.DarkCyan,
                PercentageFormat = "{0,7:N2}% ",
            };

            return new ProgressBar(0, name, options);
        }

        public static ChildProgressBar CreateChildProgressBar(IProgressBar progressBar, string name)
        {
            var options = new ProgressBarOptions
            {
                DisplayTimeInRealTime = false,
                ProgressBarOnBottom = true,
                DisablePercentageAtZeroMaxTicks = true,
                ShowDuration = false,
                ProgressCharacter = '─',
                PercentageFormat = "{0,7:N2}% ",
            };

            return progressBar.Spawn(0, name, options);
        }
    }
}
