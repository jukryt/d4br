using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Collections;
using System.Reflection;

namespace Importer.Serializer
{
    internal class ContractResolver : DefaultContractResolver
    {
        public static readonly ContractResolver Instance = new();

        private ContractResolver()
        {
        }

        protected override string ResolvePropertyName(string propertyName)
        {
            return propertyName.ToLower();
        }

        protected override JsonProperty CreateProperty(MemberInfo member, MemberSerialization memberSerialization)
        {
            var property = base.CreateProperty(member, memberSerialization);

            if (string.IsNullOrEmpty(property.UnderlyingName) ||
                property.PropertyType == null)
                return property;

            if (property.PropertyType.IsAssignableTo(typeof(IEnumerable)) &&
                !property.PropertyType.IsAssignableTo(typeof(string)))
                property.ShouldSerialize = i => CheckEnumerableAny(i, property.UnderlyingName);

            return property;
        }

        protected override IList<JsonProperty> CreateProperties(Type type, MemberSerialization memberSerialization)
        {
            return base.CreateProperties(type, memberSerialization)
                .OrderBy(p => GetParrentCount(p.DeclaringType))
                .ToList();
        }

        private int GetParrentCount(Type? type)
        {
            var parrentCount = -1;

            var currentType = type;
            if (currentType == null)
                return parrentCount;

            do
            {
                parrentCount++;
                currentType = currentType.BaseType;
            }
            while (currentType != null);

            return parrentCount;
        }

        private bool CheckEnumerableAny(object? instance, string propertyName)
        {
            if (instance == null)
                return false;

            var type = instance.GetType();
            var property = type?.GetProperty(propertyName);
            var enumirable = property?.GetValue(instance) as IEnumerable;

            if (enumirable == null)
                return false;

            return enumirable.GetEnumerator().MoveNext();
        }
    }
}
