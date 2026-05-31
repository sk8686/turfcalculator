from playwright.sync_api import sync_playwright
import re

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    bugs = []

    # Test 1: Sod Calculator - verify calculation accuracy
    print("=== Sod Calculator Accuracy ===")
    page = browser.new_page()
    page.goto('http://localhost:3000/en/sod-calculator.html', wait_until='networkidle')
    page.wait_for_timeout(500)
    
    # Default: 50x30 = 1500 sq ft, 10% waste = 1650 sq ft
    # Standard roll 10 sq ft: ceil(1650/10) = 165 rolls
    # Pallets: ceil(1650/500) = 4 pallets
    # Cost: 1650*0.30=$495 to 1650*0.80=$1320
    results = page.locator('#sod-results').inner_text()
    print(f"  Default (50x30): {results[:200]}")
    if '1,500' not in results and '1500' not in results:
        bugs.append("Sod calc: 50x30 should show 1,500 sq ft area")
    if '165' not in results:
        bugs.append("Sod calc: 50x30 with 10% waste should show 165 rolls")
    
    # Test with zero/negative
    page.fill('#sod-length', '0')
    page.wait_for_timeout(300)
    results_zero = page.locator('#sod-results').inner_html()
    has_zero_results = len(results_zero.strip()) == 0
    print(f"  Zero length: results empty = {has_zero_results}")
    if not has_zero_results:
        bugs.append("Sod calc: zero length should show no results")
    
    # Test with very large number
    page.fill('#sod-length', '999999')
    page.fill('#sod-width', '999999')
    page.wait_for_timeout(300)
    results_large = page.locator('#sod-results').inner_html()
    has_large_results = len(results_large.strip()) > 0
    print(f"  Large numbers: has results = {has_large_results}")
    
    # Test with decimal
    page.fill('#sod-length', '10.5')
    page.fill('#sod-width', '20.5')
    page.wait_for_timeout(300)
    results_decimal = page.locator('#sod-results').inner_text()
    print(f"  Decimal (10.5x20.5): {results_decimal[:150]}")
    # 10.5 * 20.5 = 215.25 sq ft
    
    page.close()
    
    # Test 2: Fertilizer Calculator - verify type switching
    print("\n=== Fertilizer Calculator Type Switching ===")
    page = browser.new_page()
    page.goto('http://localhost:3000/en/fertilizer-calculator.html', wait_until='networkidle')
    page.wait_for_timeout(500)
    
    # Default should be maintenance type
    results_default = page.locator('#fertilizer-results').inner_text()
    print(f"  Default (maintenance): {results_default[:150]}")
    if '30-0-4' not in results_default:
        bugs.append("Fertilizer calc: default should show 30-0-4 NPK for maintenance")
    
    # Click starter
    starter_btn = page.locator('[data-fert-type="starter"]')
    if starter_btn.count() > 0:
        starter_btn.click()
        page.wait_for_timeout(300)
        results_starter = page.locator('#fertilizer-results').inner_text()
        print(f"  Starter: {results_starter[:150]}")
        if '18-24-12' not in results_starter:
            bugs.append("Fertilizer calc: starter should show 18-24-12 NPK")
    else:
        bugs.append("Fertilizer calc: no starter button found")
    
    # Click weed_and_feed
    weed_btn = page.locator('[data-fert-type="weed_and_feed"]')
    if weed_btn.count() > 0:
        weed_btn.click()
        page.wait_for_timeout(300)
        results_weed = page.locator('#fertilizer-results').inner_text()
        print(f"  Weed & Feed: {results_weed[:150]}")
        if '22-3-14' not in results_weed:
            bugs.append("Fertilizer calc: weed_and_feed should show 22-3-14 NPK")
    else:
        bugs.append("Fertilizer calc: no weed_and_feed button found")
    
    page.close()
    
    # Test 3: Grass Seed Calculator - verify seeding type switching
    print("\n=== Grass Seed Calculator Type Switching ===")
    page = browser.new_page()
    page.goto('http://localhost:3000/en/grass-seed-calculator.html', wait_until='networkidle')
    page.wait_for_timeout(500)
    
    results_new = page.locator('#seed-results').inner_text()
    print(f"  New lawn: {results_new[:150]}")
    
    # Click overseed
    overseed_btn = page.locator('[data-seeding-type="overseed"]')
    if overseed_btn.count() > 0:
        overseed_btn.click()
        page.wait_for_timeout(300)
        results_overseed = page.locator('#seed-results').inner_text()
        print(f"  Overseed: {results_overseed[:150]}")
    else:
        bugs.append("Seed calc: no overseed button found")
    
    # Test st_augustine (sod only)
    page.select_option('#seed-grass-select', 'st_augustine')
    page.wait_for_timeout(300)
    results_sod = page.locator('#seed-results').inner_text()
    print(f"  St Augustine (sod only): {results_sod[:150]}")
    if 'sod' not in results_sod.lower() and 'not available' not in results_sod.lower() and 'plugs' not in results_sod.lower():
        bugs.append("Seed calc: St Augustine should indicate sod/plugs only")
    
    page.close()
    
    # Test 4: Area Converter - verify conversion accuracy
    print("\n=== Area Converter Accuracy ===")
    page = browser.new_page()
    page.goto('http://localhost:3000/en/area-converter.html', wait_until='networkidle')
    page.wait_for_timeout(500)
    
    # 1000 sq ft to sq m should be ~92.9
    page.fill('#converter-value', '1000')
    page.wait_for_timeout(300)
    result_text = page.locator('#converter-result').text_content()
    print(f"  1000 sqft -> sqm: {result_text}")
    if '92.9' not in result_text:
        bugs.append(f"Area converter: 1000 sqft should be ~92.9 sqm, got: {result_text}")
    
    # Test swap
    from_before = page.locator('#converter-from').input_value()
    to_before = page.locator('#converter-to').input_value()
    page.click('#converter-swap')
    page.wait_for_timeout(300)
    from_after = page.locator('#converter-from').input_value()
    to_after = page.locator('#converter-to').input_value()
    swapped_correctly = from_before == to_after and to_before == from_after
    print(f"  Swap: from={from_before}->{from_after}, to={to_before}->{to_after}, correct={swapped_correctly}")
    if not swapped_correctly:
        bugs.append("Area converter: swap not working correctly")
    
    page.close()
    
    # Test 5: Soil Calculator - verify depth calculation
    print("\n=== Soil Calculator Accuracy ===")
    page = browser.new_page()
    page.goto('http://localhost:3000/en/soil-calculator.html', wait_until='networkidle')
    page.wait_for_timeout(500)
    
    # 1000 sq ft, 3 inches depth
    # cubic yards = (1000 * 3) / 324 = 9.26 cu yd
    page.fill('#soil-area', '1000')
    page.fill('#soil-depth', '3')
    page.wait_for_timeout(300)
    soil_results = page.locator('#soil-results').inner_text()
    print(f"  1000sqft x 3in: {soil_results[:200]}")
    if '9.26' not in soil_results and '9.25' not in soil_results:
        bugs.append(f"Soil calc: 1000sqft x 3in should be ~9.26 cu yd")
    
    page.close()
    
    # Test 6: Water Calculator - verify with sun_shade_mix
    print("\n=== Water Calculator with sun_shade_mix ===")
    page = browser.new_page()
    page.goto('http://localhost:3000/en/lawn-water-calculator.html', wait_until='networkidle')
    page.wait_for_timeout(500)
    
    # Check if sun_shade_mix option exists
    sun_shade_option = page.locator('option[value="sun_shade_mix"]')
    has_sun_shade = sun_shade_option.count() > 0
    print(f"  Has sun_shade_mix option: {has_sun_shade}")
    if not has_sun_shade:
        bugs.append("Water calc: missing sun_shade_mix option")
    
    page.close()
    
    # Test 7: Cross-tool data passing (area calculator -> sod calculator)
    print("\n=== Cross-tool Data Passing ===")
    page = browser.new_page()
    page.goto('http://localhost:3000/en/lawn-area-calculator.html', wait_until='networkidle')
    page.wait_for_timeout(500)
    
    # Check if "Send to Sod Calculator" link exists in results
    area_results = page.locator('#area-results').inner_html()
    has_send_link = 'sod-calculator' in area_results or 'sod' in area_results.lower()
    print(f"  Has send-to-sod link: {has_send_link}")
    if not has_send_link:
        bugs.append("Area calc: missing 'Send to Sod Calculator' link in results")
    
    page.close()
    
    # Test 8: Accordion functionality
    print("\n=== Accordion Functionality ===")
    page = browser.new_page()
    page.goto('http://localhost:3000/en/sod-calculator.html', wait_until='networkidle')
    page.wait_for_timeout(500)
    
    # Find first accordion trigger
    triggers = page.locator('.accordion__trigger')
    if triggers.count() > 0:
        # Check initial state - content should be hidden
        first_content = page.locator('.accordion__content').first
        initially_hidden = first_content.is_hidden()
        print(f"  Accordion initially hidden: {initially_hidden}")
        
        # Click to open
        triggers.first.click()
        page.wait_for_timeout(300)
        after_click_visible = first_content.is_visible()
        print(f"  Accordion opens on click: {after_click_visible}")
        if not after_click_visible:
            bugs.append("Accordion: clicking trigger does not open content")
        
        # Click again to close
        triggers.first.click()
        page.wait_for_timeout(300)
        after_second_click_hidden = first_content.is_hidden()
        print(f"  Accordion closes on second click: {after_second_click_hidden}")
        if not after_second_click_hidden:
            bugs.append("Accordion: clicking trigger again does not close content")
    else:
        bugs.append("No accordion triggers found on sod-calculator page")
    
    page.close()
    
    # Summary
    print(f"\n=== ROUND 2 SUMMARY ===")
    print(f"Bugs found: {len(bugs)}")
    for i, bug in enumerate(bugs, 1):
        print(f"  {i}. {bug}")
    
    browser.close()
