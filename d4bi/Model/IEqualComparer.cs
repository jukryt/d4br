namespace Importer.Model
{
    internal interface IEqualComparer<T>
    {
        bool Equals(T x, T y);
    }
}
