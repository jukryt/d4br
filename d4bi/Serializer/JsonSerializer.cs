using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Importer.Serializer
{
    internal static class JsonSerializer
    {
        private static readonly JsonSerializerSettings JsonSerializerSettings = new JsonSerializerSettings
        {
            ConstructorHandling = ConstructorHandling.AllowNonPublicDefaultConstructor,
            ContractResolver = ContractResolver.Instance,
            Converters = { new StringEnumConverter() },
            Formatting = Formatting.Indented,
        };

        public static string Serialize(object obj)
        {
            return JsonConvert.SerializeObject(obj, JsonSerializerSettings);
        }

        public static T Deserialize<T>(string text)
        {
            return JsonConvert.DeserializeObject<T>(text, JsonSerializerSettings);
        }
    }
}
