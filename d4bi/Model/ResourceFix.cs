namespace Importer.Model
{
    internal class ResourceFix<T> where T : Item
    {
        public ResourceFix()
        {
            ItemActions = [];
        }

        public IReadOnlyCollection<IFixItemAction<T>> ItemActions { get; init; }
    }
}
