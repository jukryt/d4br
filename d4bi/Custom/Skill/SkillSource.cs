using Importer.Model;
using Importer.Processor;
using Importer.Report;

namespace Importer.Custom.Skill
{
    internal class SkillSource : ResourceSource<SkillItem>
    {
        public required string DetailsUrlTemplate { get; init; }
        public required string ModNamesScript { get; init; }

        public override ResourceReader<SkillItem> CreateReader(ProgressReporter progressReporter)
        {
            return new SkillReader(this, progressReporter);
        }
    }
}
