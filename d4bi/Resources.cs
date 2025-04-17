using Importer.Model;
using Importer.Resource;

namespace Importer
{
    internal static class Resources
    {
        public static IEnumerable<ResourceCollection> GetResources()
        {
            return [
                ResourceEn.GetResources(),
                ResourceRu.GetResources(),
            ];
        }
    }
}
