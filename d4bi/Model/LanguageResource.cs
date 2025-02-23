namespace Importer.Model
{
    internal class LanguageResource<T> where T : Item
    {
        public required List<T> Items { get; init; }
    }
}
