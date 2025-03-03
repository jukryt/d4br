namespace Importer.Model
{
    internal class ClassItem : Item
    {
        public string[] Classes { get; set; } = [];
    }

    internal class ClassItemEqualComparer : ItemEqualComparer<ClassItem>
    {
        public override bool Equals(ClassItem x, ClassItem y)
        {
            if (!base.Equals(x, y))
                return false;

            return x.Classes.Length == 0 || y.Classes.Length == 0 ||
                x.Classes.Intersect(y.Classes).Any();
        }
    }
}
