using Importer.Model;

namespace Importer.Custom.Skill
{
    internal class SkillItem : ClassItem
    {
        public bool IsActive { get; set; }
        public List<SkillMod> Mods { get; set; } = [];
    }

    internal class SkillMod
    {
        public SkillMod(long id, string name)
        {
            Id = id;
            Name = name;
        }

        public long Id { get; }
        public string Name { get; set; }
    }
}
