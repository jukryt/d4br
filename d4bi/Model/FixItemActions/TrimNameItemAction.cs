namespace Importer.Model.FixItemActions
{
    internal class TrimNameItemAction<T> : IFixItemAction<T> where T : Item
    {
        public Task FixItemAsync(T item)
        {
            item.Name = item.Name?.Trim();
            return Task.CompletedTask;
        }
    }
}
