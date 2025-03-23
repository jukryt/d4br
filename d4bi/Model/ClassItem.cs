namespace Importer.Model
{
    internal class ClassItem : Item
    {
        public string[] Classes { get; set; } = [];
    }

    internal class ClassItemEqualComparer<T> : ItemEqualComparer<T> where T : ClassItem
    {
        public override bool Equals(T x, T y)
        {
            if (!base.Equals(x, y))
                return false;

            return x.Classes.Length == 0 || y.Classes.Length == 0 ||
                x.Classes.Intersect(y.Classes).Any();
        }
    }
}
