import type { ReferenceDefinition } from '~/types/api'

export const useReferences = () => {
    const searchReferenceDefinitions = async (query: string): Promise<ReferenceDefinition[]> => {
        return [] 
    }

    return { searchReferenceDefinitions }
}