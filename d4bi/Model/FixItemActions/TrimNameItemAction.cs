namespace Importer.Model.FixItemActions
{
    internal class TrimNameItemAction : IFixItemAction<Item>
    {
        public Task FixItemAsync(Item item)
        {
            item.Name = item.Name?.Trim();
            return Task.CompletedTask;
        }
    }
}
