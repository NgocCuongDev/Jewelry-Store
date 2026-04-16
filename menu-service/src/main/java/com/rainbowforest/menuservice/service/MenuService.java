package com.rainbowforest.menuservice.service;

import com.rainbowforest.menuservice.entity.Menu;
import com.rainbowforest.menuservice.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MenuService {

    @Autowired
    private MenuRepository menuRepository;

    public List<Menu> getPublicMenus() {
        List<Menu> allMenus = menuRepository.findAllByStatusOrderBySortOrderAsc(1);
        
        // Build the tree structure
        Map<Long, List<Menu>> childrenByParentId = allMenus.stream()
                .filter(m -> m.getParentId() != null && m.getParentId() != 0)
                .collect(Collectors.groupingBy(Menu::getParentId));

        List<Menu> rootMenus = allMenus.stream()
                .filter(m -> m.getParentId() == null || m.getParentId() == 0)
                .collect(Collectors.toList());

        rootMenus.forEach(m -> buildTree(m, childrenByParentId));

        return rootMenus;
    }

    private void buildTree(Menu parent, Map<Long, List<Menu>> childrenByParentId) {
        List<Menu> children = childrenByParentId.getOrDefault(parent.getId(), new ArrayList<>());
        parent.setChildren(children);
        children.forEach(child -> buildTree(child, childrenByParentId));
    }
    
    public Menu addMenu(Menu menu) {
        return menuRepository.save(menu);
    }
}
