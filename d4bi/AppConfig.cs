using Importer.Extension;
using Importer.Serializer;
using System.Diagnostics;

namespace Importer
{
    internal class AppConfig
    {
        private const string AppConfigFileName = "_app.config.json";

        public string WorkFolder { get; set; } = string.Empty;
        public int BrowserRequestTimeout { get; set; } = 30 * 1000;

        public static async Task<AppConfig> LoadAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                return await GetAppConfigAsync(AppConfigFileName, cancellationToken);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.GetMessage());
                Console.WriteLine(ex.GetMessage());
                throw;
            }
        }

        public async Task SaveAsync(CancellationToken cancellationToken = default)
        {
            var fileName = AppConfigFileName;
            try
            {
                var jsonString = JsonSerializer.Serialize(this);
                await File.WriteAllTextAsync(fileName, jsonString, cancellationToken);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.GetMessage());
                Console.WriteLine(ex.GetMessage());
            }
        }

        private static async Task<AppConfig> GetAppConfigAsync(string fileName, CancellationToken cancellationToken)
        {
            if (File.Exists(fileName))
            {
                var jsonString = await File.ReadAllTextAsync(fileName, cancellationToken);
                return JsonSerializer.Deserialize<AppConfig>(jsonString);
            }

            return new AppConfig();
        }
    }
}
