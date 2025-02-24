namespace Importer.Model
{
    internal interface IFixItemAction<T> where T : Item
    {
        public Task FixItemAsync(T item);
    }
}
