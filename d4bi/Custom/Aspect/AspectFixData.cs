using Importer.Fixer;
using Importer.Model;
using Importer.Report;

namespace Importer.Custom.Aspect
{
    internal class AspectFixData : IItemsFixer<ClassItem>
    {
        private readonly Dictionary<long, Func<ClassItem, bool>> TemperFixers = new()
        {
            [1848038] = (aspect) =>
                UpdateName(aspect, "of Compound Fracture Aspect", "Aspect of Compound Fracture"),
            [2152208] = (aspect) =>
                UpdateName(aspect, "of Siphoning Strikes Aspect", "Aspect of Siphoning Strikes"),
            [2574563] = (aspect) =>
                UpdateName(aspect, "of Cold Judgement Aspect", "Aspect of Cold Judgement"),
            [2574604] = (aspect) =>
                UpdateName(aspect, "of Arcane Ward Aspect", "Aspect of Arcane Ward"),
        };

        public Task FixItemsAsync(List<ClassItem> items, IMessageReporter reporter)
        {
            foreach (var item in items)
            {
                if (TemperFixers.TryGetValue(item.Id, out var temperFix))
                {
                    if (!temperFix(item))
                        reporter.WriteMessage($"Fix not completed ({item.Id})", nameof(AspectFixData));
                }
            }

            return Task.CompletedTask;
        }

        private static bool UpdateName(ClassItem item, string? oldName, string newName)
        {
            if (item.Name != oldName)
                return false;

            item.Name = newName;
            return true;
        }
    }
}
